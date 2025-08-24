import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'

const AppLayout = ({ theme, setTheme, searchTerm, setSearchTerm }) => (
  <main className="holder grid min-h-screen grid-cols-2 grid-rows-[auto_1fr] gap-4">
    <Header
      theme={theme}
      setTheme={setTheme}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
    <div className="col-span-2 mt-4">
      <Outlet /> {/* All page content renders here */}
    </div>
    <Footer className="col-span-2" />
  </main>
)

export default AppLayout
