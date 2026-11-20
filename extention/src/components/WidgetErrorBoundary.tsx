import { Component, type ReactNode } from 'react';

/** A broken widget must not unmount the rest of the workspace. */
export default class WidgetErrorBoundary extends Component<{ children: ReactNode; message: string }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? <p role="status" className="k-widget-error">{this.props.message}</p> : this.props.children; }
}

/** Evaluate render callbacks under the boundary, including synchronous failures. */
export function WidgetRender({ render }: { render: () => ReactNode }) { return render(); }
