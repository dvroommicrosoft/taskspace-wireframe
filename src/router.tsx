import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import {
  ArtifactRoute,
  TaskRoute,
  WorkspaceRoute,
  WorkspaceShell,
} from './ui'

const rootRoute = createRootRoute({
  component: () => (
    <WorkspaceShell>
      <Outlet />
    </WorkspaceShell>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WorkspaceRoute,
})

const taskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$taskId',
  component: TaskRoute,
})

const artifactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$taskId/artifacts/$artifactId',
  component: ArtifactRoute,
})

const routeTree = rootRoute.addChildren([indexRoute, taskRoute, artifactRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
