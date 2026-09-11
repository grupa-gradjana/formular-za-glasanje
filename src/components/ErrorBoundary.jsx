import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="shell" role="alert">
                    <h1 className="h1 mb-3">Nešto je pošlo naopako</h1>
                    <p className="lead mb-4">
                        Osvežite stranicu i pokušajte ponovo. Upisani podaci se
                        pri tome brišu jer se nigde ne čuvaju.
                    </p>
                    <p className="field-hint">
                        {this.state.error?.toString()}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
