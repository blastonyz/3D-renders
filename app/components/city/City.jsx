'use client'
import { useEffect, useState } from "react";
import Image from "next/image";

const City = () => {
    const [showSecondImage, setShowSecondImage] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            //offsetHeigth altura de un elemento, incluyendo su contenido, padding y bordes, pero no el margen
            const firstSectionHeight = document.querySelector(".firstSection").offsetHeight;
            if (window.scrollY > firstSectionHeight) {
                setShowSecondImage(true);
            } else {
                setShowSecondImage(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <main className="mainSection">
            <section className="firstSection">
                <Image
                    alt="ciudad"
                    src={`/city3.jpeg`}
                    fill
                    sizes="100vh"
                    objectFit= "contain" 
                    quality={100}
                    className="back1"
                    priority={true} /* Añade esta línea si la imagen es importante para el LCP */
                />
            </section>
            <section className={`secondSection ${showSecondImage ? "active" : ""}`}>
                <Image
                    alt="ciudad"
                    src={`/city4.jpeg`}
                    fill
                    sizes="100vh"
                    objectFit= "contain" 
                    loading="lazy"
                    quality={100}
                    className="back2"
                />
            </section>
        </main>
    );
};


export default City;