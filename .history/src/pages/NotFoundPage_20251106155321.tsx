import './NotFoundPage.css'
import { Header } from '../components/Header';

export function NotFoundPage({cart}){
    return(
        <>
        <title>404 page Not Found</title>
        <link rel="icon" href="home-favicon.png" type='image/svg+xml'/>
        <Head cart={cart}/>
        
        <div className='not-found-message'>
            Page not found
        </div>
        </>

    );

}