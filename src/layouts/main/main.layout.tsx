import HeaderLayout from './Header.layout'
import FooterLayout from './Footer.layout'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterLayout />
    </div>
  )
}

export default MainLayout;
