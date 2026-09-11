#!/usr/bin/env bash
#
# End-to-end test: drives the whole form in a real Chrome and checks the PDF.
#
#   scripts/e2e.sh                  # all three document paths
#   scripts/e2e.sh licna-karta      # just the ID-card path (two images)
#   scripts/e2e.sh pasos            # just the passport path (one image)
#   scripts/e2e.sh licna-karta-cip  # chip card: no image at all, 1-page PDF
#   scripts/e2e.sh both             # only the two paths that upload an image
#   scripts/e2e.sh all --keep       # keep the captured PDFs and page renders
#
# Requires chrome-cli, and Chrome with
#   View > Developer > Allow JavaScript from Apple Events
# enabled. Without it chrome-cli returns an empty string instead of an error,
# so this script checks for it up front. `gs` (ghostscript) is optional and
# only used to render the result for a visual check.
#
# A test run leaves nothing on the device, which is the same property the app
# itself promises. Nothing has to be intercepted to keep it that way any more:
# the app never triggers a download by itself: the file is saved only when the
# user taps the <a download> on the final screen. This script therefore reads
# that link's blob instead of clicking it, and checks ~/Downloads stayed as it
# was. Do not "fix" it by clicking the link: `execute` runs in an ISOLATED
# world, so the click would be a real one and would write the PDF to
# ~/Downloads for real.
#
# Two chrome-cli facts this script is built around, both easy to trip over:
#   1. `execute` must return a string. Returning a number crashes chrome-cli.
#   2. `execute` runs in an ISOLATED world. The DOM is shared, so clicking,
#      typing and reading the DOM all work, but page globals and prototypes are
#      not reachable — and neither is anything the page keeps in memory except
#      through the DOM. The bytes come back through a hidden element.

set -uo pipefail

PORT=4173
URL="http://localhost:$PORT/"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOC_ARG="${1:-all}"
KEEP=""
[ "${2:-}" = "--keep" ] && KEEP=1
OUT="$(mktemp -d)"
# Read the download name out of the source rather than repeating it here: the
# two drifted apart once already, and a stale copy fails the run on the last
# assertion, long after the interesting part has passed.
PDF_FILE_NAME="$(sed -n 's/^ *"\{0,1\}\(Zahtev[^"]*\.pdf\)".*/\1/p' "$ROOT/src/pdfAssets.js" | head -1)"
TAB=""
STARTED_SERVER=""
FAILED=0
# The app only downloads when a real tap lands on the final screen's link, and
# this script never taps it — so the folder must look the same afterwards.
# Counted rather than listed: a previous, unrelated copy may well be there.
downloads_count() { ls ~/Downloads 2>/dev/null | grep -Fc "${PDF_FILE_NAME%.pdf}"; }
DL_BEFORE="$(downloads_count)"

cleanup() {
    [ -n "$TAB" ] && chrome-cli close -t "$TAB" >/dev/null 2>&1
    # Killing the backgrounded subshell leaves vite itself running, so target
    # whatever is listening on the port. Safe: we only start a server when the
    # port was free, so anything on it now is ours.
    if [ -n "$STARTED_SERVER" ]; then
        lsof -ti "tcp:$PORT" 2>/dev/null | xargs kill 2>/dev/null
    fi
    if [ -n "$KEEP" ]; then
        echo "artifacts kept in $OUT (PDFs and page renders)"
    else
        rm -rf "$OUT"
    fi
}
trap cleanup EXIT

fail() { echo "FAIL: $*" >&2; FAILED=1; }

# --- chrome-cli helpers ---------------------------------------------------

js() { chrome-cli execute "$1" -t "$TAB" 2>/dev/null; }

waitfor() { # $1 = JS returning 'y' when ready, $2 = description
    local i
    for i in $(seq 1 80); do
        [ "$(js "$1")" = "y" ] && return 0
    done
    fail "timed out waiting for $2"
    return 1
}

# Buttons only, on purpose. "Preuzmite PDF" on the final screen is a real
# <a download> (iOS honours a download only when the tap lands on the anchor
# itself), and clicking it from here would be a real download into
# ~/Downloads. That link is checked by reading its attributes and fetching its
# blob instead.
click() { # click a button by its visible text
    local r
    r=$(js "(function(){var b=[...document.querySelectorAll('button')].find(x=>x.textContent.indexOf('$1')>=0);if(!b)return 'MISSING';if(b.disabled)return 'DISABLED';b.click();return 'ok';})()")
    if [ "$r" != "ok" ]; then fail "button '$1' -> ${r:-no response}"; return 1; fi
    return 0
}

# --- prerequisites --------------------------------------------------------

command -v chrome-cli >/dev/null || { echo "chrome-cli not installed (brew install chrome-cli)" >&2; exit 1; }

if ! curl -sf -o /dev/null "$URL"; then
    [ -d "$ROOT/dist" ] || (cd "$ROOT" && npm run build >/dev/null) || { echo "build failed" >&2; exit 1; }
    (cd "$ROOT" && npm run preview -- --port "$PORT" >"$OUT/preview.log" 2>&1) &
    STARTED_SERVER=1
    for _ in $(seq 1 40); do curl -sf -o /dev/null "$URL" && break; done
    curl -sf -o /dev/null "$URL" || { echo "preview server did not start; see $OUT/preview.log" >&2; exit 1; }
fi

chrome-cli open "$URL" >/dev/null
TAB=$(chrome-cli info | awk '/^Id:/{print $2; exit}')
[ -n "$TAB" ] || { echo "could not determine Chrome tab id" >&2; exit 1; }

if [ "$(js "String(1+1)")" != "2" ]; then
    echo "chrome-cli cannot run JavaScript in this tab." >&2
    echo "Enable: Chrome > View > Developer > Allow JavaScript from Apple Events" >&2
    exit 1
fi

# --- one full pass through the wizard -------------------------------------

upload() { # $1 = label drawn on the synthetic document image
    waitfor "(function(){return document.getElementById('image-upload')?'y':'';})()" "file input" || return 1
    js "(function(){
        var c=document.createElement('canvas');c.width=850;c.height=520;var x=c.getContext('2d');
        x.fillStyle='#dbeafe';x.fillRect(0,0,850,520);x.fillStyle='#111';x.font='bold 44px sans-serif';
        x.fillText('$1',60,280);x.strokeStyle='#111';x.lineWidth=6;x.strokeRect(10,10,830,500);
        var d=c.toDataURL('image/jpeg').split(',')[1];var bin=atob(d);var a=new Uint8Array(bin.length);
        for(var i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);
        var dt=new DataTransfer();dt.items.add(new File([a],'id.jpg',{type:'image/jpeg'}));
        var inp=document.getElementById('image-upload');inp.files=dt.files;
        inp.dispatchEvent(new Event('change',{bubbles:true}));return 'ok';})()" >/dev/null
    waitfor "(function(){return [...document.querySelectorAll('button')].some(b=>b.textContent.indexOf('Potvrdite sliku')>=0)?'y':'';})()" "cropper" || return 1
    # The crop is confirmed on the photo screen itself - there is no separate
    # confirmation screen any more, so this is one click per side, not two.
    click "Potvrdite sliku" || return 1
}

# Pick the document on the choice screen. The pasoš stands alone there; both
# lična karta routes are behind a disclosure, because a chip card must not be
# photographed - its prebivalište is only on the chip - and the chip route is a
# link that leaves for a screen of its own instead of arming "Nastavite".
choose_document() { # $1 = licna-karta | pasos | licna-karta-cip
    local r
    if [ "$1" != "pasos" ]; then
        click "Ako vam je istekao pasoš" || return 1
    fi
    if [ "$1" = "licna-karta-cip" ]; then
        click "Lična karta sa čipom" || return 1
        waitfor "(function(){return document.getElementById('chip-title')?'y':'';})()" \
            "chip card step" || return 1
        click "Nastavite" || return 1
        return 0
    fi
    r=$(js "(function(){var t='$1'==='pasos'?'Pasoš':'Lična karta bez čipa';
        var d=[...document.querySelectorAll('[role=radio]')].find(x=>x.textContent.indexOf(t)>=0);
        if(!d)return 'MISSING';d.click();return 'ok';})()")
    [ "$r" = "ok" ] || { fail "$1: radio -> ${r:-no response}"; return 1; }
    click "Nastavite" || return 1
}

run_flow() { # $1 = licna-karta | pasos | licna-karta-cip
    local doc="$1" expected_len r pdf="$OUT/$1.pdf"
    # A chip card puts no image page in the PDF: the očitana lična karta is a
    # separate attachment the user makes themselves, outside this app.
    local want_pages=2
    [ "$doc" = "licna-karta-cip" ] && want_pages=1
    echo "--- $doc ---"

    chrome-cli reload -t "$TAB" >/dev/null
    waitfor "(function(){return document.querySelector('h1')?'y':'';})()" "app load" || return 1
    click "Počnite" || return 1
    waitfor "(function(){return document.getElementById('fullName')?'y':'';})()" "personal data form" || return 1

    # React ignores a plain el.value assignment; go through the native setter.
    js "(function(){
        var set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
        var v={fullName:'Đorđe Šišković-Žnidaršič',parentName:'Ljubinka Čačić',jmbg:'0101990710015',
               addressSerbia:'Bulevar Kralja Aleksandra 73',addressAbroad:'Große Bockenheimer Straße 45',
               votingLocation:'Frankfurt, Nemačka',phone:'+49 151 12345678',email:'djordje@example.de'};
        for(var k in v){var el=document.getElementById(k);set.call(el,v[k]);el.dispatchEvent(new Event('input',{bubbles:true}));}
        return 'ok';})()" >/dev/null
    [ "$(js "document.getElementById('jmbg').value")" = "0101990710015" ] || fail "$doc: JMBG did not survive the input handler"

    click "Nastavite" || return 1
    waitfor "(function(){return document.getElementById('doc-type-title')?'y':'';})()" "document type step" || return 1
    choose_document "$doc" || return 1

    if [ "$doc" != "licna-karta-cip" ]; then
        upload "PREDNJA STRANA" || return 1
        if [ "$doc" = "licna-karta" ]; then
            # Confirming the front sends the user back through the same screen
            # for the back side - the most breakable part of the navigation.
            upload "ZADNJA STRANA" || return 1
        fi
    fi

    # The signature canvas has a keyboard fallback - no mouse simulation needed.
    waitfor "(function(){return document.getElementById('signature-canvas')?'y':'';})()" "signature canvas" || return 1
    js "(function(){var c=document.getElementById('signature-canvas');c.focus();
        c.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));return 'ok';})()" >/dev/null
    click "Potvrdite potpis" || return 1
    waitfor "(function(){return document.body.textContent.indexOf('Pročitajte još jednom')>=0?'y':'';})()" "review step" || return 1

    # The chip path has no images to show, so the review and the final screen
    # have to say what the user still has to attach by hand - otherwise the
    # last thing the app tells them is wrong.
    if [ "$doc" = "licna-karta-cip" ]; then
        [ "$(js "document.body.textContent.indexOf('Očitana lična karta')>=0?'y':''")" = "y" ] \
            || fail "$doc: the review does not mention the očitana lična karta"
    fi

    # The review screen only makes the PDF; the download link lives on the
    # final screen. Read that link rather than clicking it (see the header),
    # and pull the bytes back through a hidden element.
    click "Napravite PDF" || return 1
    waitfor "(function(){return [...document.querySelectorAll('a[download]')].some(a=>a.textContent.indexOf('Preuzmite PDF')>=0)?'y':'';})()" \
        "done step" || return 1

    if [ "$doc" = "licna-karta-cip" ]; then
        [ "$(js "document.body.textContent.indexOf('Uz PDF ide i očitana lična karta')>=0?'y':''")" = "y" ] \
            || fail "$doc: the final screen does not ask for the second attachment"
    fi

    r=$(js "(function(){
        var a=[...document.querySelectorAll('a[download]')].find(x=>x.textContent.indexOf('Preuzmite PDF')>=0);
        if(a.getAttribute('download')!==$(printf "'%s'" "$PDF_FILE_NAME"))return 'NAME:'+a.getAttribute('download');
        if(a.href.indexOf('blob:')!==0)return 'NOTBLOB:'+a.href.slice(0,20);
        var b=document.getElementById('__pdfbox');
        if(!b){b=document.createElement('div');b.id='__pdfbox';b.hidden=true;document.body.appendChild(b);}
        b.textContent='';
        fetch(a.href).then(function(x){return x.blob();}).then(function(x){
            var fr=new FileReader();fr.onload=function(){b.textContent=fr.result;};fr.readAsDataURL(x);});
        return 'ok';})()")
    [ "$r" = "ok" ] || { fail "$doc: download link is wrong (${r:-no response})"; return 1; }
    waitfor "(function(){var b=document.getElementById('__pdfbox');return b&&b.textContent?'y':'';})()" \
        "the PDF behind the download link" || return 1

    expected_len=$(js "String(document.getElementById('__pdfbox').textContent.length)")
    : >"$OUT/$doc.b64"
    local off=0
    while [ "$off" -lt "$expected_len" ]; do
        js "document.getElementById('__pdfbox').textContent.substr($off,40000)" | tr -d '\n' >>"$OUT/$doc.b64"
        off=$((off + 40000))
    done
    python3 - "$OUT/$doc.b64" "$pdf" <<'PYDECODE'
import base64, re, sys
raw = open(sys.argv[1]).read().strip()
open(sys.argv[2], "wb").write(base64.b64decode(re.sub(r"^data:application/pdf;base64,", "", raw)))
PYDECODE

    [ "$(head -c 4 "$pdf")" = "%PDF" ] || { fail "$doc: captured bytes are not a PDF"; return 1; }
    local size pages
    size=$(wc -c <"$pdf" | tr -d ' ')
    if command -v gs >/dev/null; then
        gs -q -dNOPAUSE -dBATCH -sDEVICE=png16m -r110 -sOutputFile="$OUT/$doc-%d.png" "$pdf" 2>/dev/null
        pages=$(ls "$OUT/$doc-"*.png 2>/dev/null | wc -l | tr -d ' ')
        [ "$pages" = "$want_pages" ] \
            || fail "$doc: expected $want_pages page(s), got $pages"
        echo "  PDF ok: $size bytes, $pages pages rendered"
    else
        echo "  PDF ok: $size bytes (install ghostscript to render pages)"
    fi

}

check_no_downloads() {
    local after
    after="$(downloads_count)"
    [ "$after" = "$DL_BEFORE" ] \
        || fail "the run wrote to ~/Downloads ($DL_BEFORE -> $after files matching ${PDF_FILE_NAME%.pdf})"
}

case "$DOC_ARG" in
    all) run_flow licna-karta; run_flow pasos; run_flow licna-karta-cip ;;
    both) run_flow licna-karta; run_flow pasos ;;
    licna-karta|pasos|licna-karta-cip) run_flow "$DOC_ARG" ;;
    *) echo "usage: $0 [licna-karta|pasos|licna-karta-cip|both|all] [--keep]" >&2; exit 1 ;;
esac

check_no_downloads

if [ "$FAILED" = "0" ]; then echo "PASS"; else echo "FAILED"; fi
exit "$FAILED"
