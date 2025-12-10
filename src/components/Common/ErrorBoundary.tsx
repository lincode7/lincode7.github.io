import { AlertCircle, RefreshCw } from "lucide-react";
import { Component, ErrorInfo, ReactNode } from "react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // 可以在这里上报错误到监控服务
    // logErrorToService(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <AlertCircle className="error-icon" size={48} />
            <h2>出了点问题</h2>
            <p className="error-description">
              页面加载时发生错误，请重试或刷新页面
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="error-details">
                <p className="error-message">{this.state.error.toString()}</p>
                <pre className="error-stack">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <div className="error-actions">
              <button
                className="error-button error-button-retry"
                onClick={this.handleRetry}
              >
                <RefreshCw size={16} />
                重试
              </button>
              <button
                className="error-button error-button-reload"
                onClick={this.handleReload}
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
