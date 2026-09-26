import { Component, type ReactNode } from 'react'

interface State {
  failed: boolean
}

/**
 * Last line of defence: if a page throws while rendering, show a calm recovery
 * screen instead of a blank page. Keyed by route in App, so navigating away
 * clears the error.
 */
export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[app] page crashed:', error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="app-error" role="alert">
        <h1 className="h2">Something went wrong.</h1>
        <p className="lead">This page hit an unexpected problem. Reloading usually fixes it.</p>
        <div className="app-error__actions">
          <button type="button" className="app-error__btn" onClick={() => window.location.reload()}>
            Reload page
          </button>
          <a className="app-error__btn app-error__btn--ghost" href="/">
            Go to home
          </a>
        </div>
      </section>
    )
  }
}
