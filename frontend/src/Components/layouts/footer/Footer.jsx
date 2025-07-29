import "./Footer.css"
import ig from "./IMG/ig.webp"
import fb from "./IMG/fb.png"
import wsp from "./IMG/wsp.webp"




export const Footer = () =>{
    return <>
        <div className="Footer" id="footer">
            <div className="Padding">
                <div className="Section">
    
                    <div className="Information">
                         <h1 className="title">Información</h1>
                        <a href="#">Terminos y condiciones</a>
                    </div>

                    <div className="Aboutus">
                        <h1 className="title">Sobre Nosotros</h1>
                        <a href="#">Quienes somos</a>
                        <p>Argentina,<br></br>Buenos Aires</p>
                        <p>MDMSYSTEM</p>
                        
                    </div>

                    <div className="Social">
                        <h1 className="title">Contacto</h1>
                        <a href="" className="w-10 ml-4 mt-2 md-4"><img src={fb} alt="" /></a>
                        <a href="" className="w-10 ml-4 mt-2 md-4"><img src={ig} alt="" /></a>
                        <a href="" className="w-10 ml-4 mt-2 md-4"><img src={wsp} alt="" /></a>

                    </div>

                



                </div>
            </div>
        </div>

            <hr></hr>
             



             

    </>
   
}