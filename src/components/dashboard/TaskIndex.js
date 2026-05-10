import SearchTask from "./SearchTask"
import HowItWorks from "./HowItWorks"
import FAQ from "./FAQ"
import Footer from "./Footer"
import RecentTask from './RecentTask';

export default function TaskIndex(){
    
    return (
        <>
            <SearchTask />
            <HowItWorks />
            <RecentTask />
            <FAQ />
            <Footer />
        </>
    )
}