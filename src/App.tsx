import { Routes, Route, Navigate } from 'react-router'
import { LoginPage } from './pages/login'
import { DashboardPage } from './pages/dashboard'
import { Layout } from './components/Layout'
import { ProtectedPageOutlet } from './modules/Auth/ProtectedPageOutlet'

export const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<ProtectedPageOutlet />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path='*' element={<Navigate to='/dashboard' />} />
      </Routes>
    </Layout>
  )
}
