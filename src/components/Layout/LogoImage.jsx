// import logo from "@/assets/Logo_png.png";
import logo from "@/assets/Citisense_Logo.png";
import { useEffect } from "react";
import { useState } from "react";

const LogoImage = () => {
    const [data, setData] = useState({ height: '40px', isShow: true, });

    useEffect(()=>{
        if(localStorage){
            let logoData = localStorage.getItem("logo");
            if(logoData){
                setData(JSON.parse(logoData));
            }
        }
    }, [])

    if(data.isShow){
        return(
            <div>
                <img src={logo} className={`h-[${data.height}]`}
                    // className={`w-[${data.width}] h-[${data.height}] object-contain bg-main rounded-full`} 
                    />
            </div>
        )
    }
    return null;
}

export default LogoImage;