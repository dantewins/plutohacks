import MainHeader from "./MainHeader"
import MainSidebar from "./MainSidebar"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <MainSidebar />
            <div className="flex flex-col">
                <MainHeader />
                <Outlet />
            </div>
        </div>

    )
}

export default MainLayout