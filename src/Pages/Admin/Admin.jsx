import React, { useEffect, useState } from 'react';
import { getCategories, getWorks,DeleteWork, ajoutPhoto} from "../../Api"
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import "./style.scss"

function Admin() {
    const [works, setWorks] = useState([])
    const [categories, setCategories] = useState([])
    const [modal, setModal] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    const [titre, setTitre] = useState("")
    const [categ, setCateg] = useState("")
    //ajoutImage = variable State qui contient l'image à ajouter
    const [ajoutImage, setAjoutImage] = useState(null)
    const [addOk, setAddOk] = useState(false)


    useEffect(() => {
        (async () => {
            setWorks(await getWorks())
        })();
    }, [])

    useEffect(() => {
        (async () => {
            setCategories(await getCategories())
        })();
    }, [])


    const deleteW = (id) => {
        if(id){
            console.log(id);
            (async () => {
                await DeleteWork(id)
            })();
            (async () => {
                setWorks(await getWorks())
            })(); 
        }

    }

    function onImageChange(e) {
        console.log(e.target.files[0])
        const maxAllowedSize = 4 * 1024 * 1024;
        const imgPrev = document.querySelector('.imgPreview');
        const imgInput = document.querySelector('.imgInput');
        if (e.target.files && e.target.files[0] && e.target.files[0].size <= maxAllowedSize) {
            setAjoutImage(e.target.files[0]);
            console.log("ajoutImage", ajoutImage);
            console.log(e.target.files[0]);
            imgInput.style.display = "none";
            imgPrev.style.backgroundRepeat = "no-repeat";
            imgPrev.style.backgroundSize = "contain";
            imgPrev.style.backgroundImage = `url(${URL.createObjectURL(e.target.files[0])})`;
        }else{
            setAjoutImage(null);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        titre !== "" ? console.log("titre ok") : console.log("titre", titre);
        categ !== "" ? console.log("categ ok") : console.log("categ", categ);
        ajoutImage !== null ? console.log("image ok") : console.log("image pas ok");
        if ( titre && categ && ajoutImage) {
            let bodyAEnvoyer = {
                title: titre,
                image: ajoutImage,
                category: categ
            }
            console.log("ImageAEnvoyer", ajoutImage);
            (async () => {
                await ajoutPhoto(bodyAEnvoyer)
            })();
            setAddOk(true);
            setTimeout(() => {
                setAddOk(false);
                setModalAdd(false);
            }, 3000);
            (async () => {
                setWorks(await getWorks())
            })(); 
        }
    }
    

    return (
        <main className='Home'>
            {/* https://react.dev/reference/react-dom/createPortal */}
            {/* createPortal permet d'injecter de l'HTML dans d'autres parties de notre HTML */}
            {/* Par exemple, ici j'injecte ma modale dans document.body, qui par defaut n'est pas accessible avec ReactJs */}
            {modal && !modalAdd && createPortal(
                // Ici je fais mon HTML
                <div className="modal">
                    <div className="modal__content">
                        <h2>Gallerie photo</h2>
                        <div className="delete-icon" onClick={() => setModal(false)}>
                                x
                        </div>
                        <div className="modal__content-gallery">
                            {works.map((work) => (
                                <div key={work.id}>
                                    <img src={work.imageUrl} alt={work.title} />
                                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteW(work.id)} />
                                </div>
                            ))}
                        </div>
                        <div className="line"></div>
                        <button className="addPhoto" onClick={()=>setModalAdd(true)}>Ajouter une photo</button>
                    </div>
                </div>,
                // Puis je précise l'endroit ou j'inject
                document.body
            )}
            {modalAdd && createPortal(
                // Ici je fais mon HTML
                <div className="modal">
                    <div className="modal__content">
                        <h2>Ajout photo</h2>
                        <div className="delete-icon" onClick={() => setModalAdd(false)}>
                                x
                        </div>
                        <div className="modal__content-gallery2">
                        <form action="" onSubmit={handleSubmit} method="post">
                                    <div className="imgPreview">
                                        <div className="imgInput">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
                                            <path d="M63.5517 15.8879C64.7228 15.8879 65.681 16.8461 65.681 18.0172V60.5768L65.0156 59.7118L46.9165 36.2894C46.3176 35.5042 45.3727 35.0517 44.3879 35.0517C43.4031 35.0517 42.4715 35.5042 41.8594 36.2894L30.8136 50.5824L26.7546 44.8998C26.1557 44.0614 25.1975 43.569 24.1595 43.569C23.1214 43.569 22.1632 44.0614 21.5644 44.9131L10.9178 59.8183L10.319 60.6434V60.6034V18.0172C10.319 16.8461 11.2772 15.8879 12.4483 15.8879H63.5517ZM12.4483 9.5C7.75048 9.5 3.93103 13.3195 3.93103 18.0172V60.6034C3.93103 65.3012 7.75048 69.1207 12.4483 69.1207H63.5517C68.2495 69.1207 72.069 65.3012 72.069 60.6034V18.0172C72.069 13.3195 68.2495 9.5 63.5517 9.5H12.4483ZM23.0948 35.0517C23.9337 35.0517 24.7644 34.8865 25.5394 34.5655C26.3144 34.2444 27.0186 33.7739 27.6118 33.1807C28.2049 32.5876 28.6755 31.8834 28.9965 31.1083C29.3175 30.3333 29.4828 29.5027 29.4828 28.6638C29.4828 27.8249 29.3175 26.9943 28.9965 26.2192C28.6755 25.4442 28.2049 24.74 27.6118 24.1468C27.0186 23.5537 26.3144 23.0831 25.5394 22.7621C24.7644 22.4411 23.9337 22.2759 23.0948 22.2759C22.2559 22.2759 21.4253 22.4411 20.6503 22.7621C19.8752 23.0831 19.171 23.5537 18.5779 24.1468C17.9847 24.74 17.5142 25.4442 17.1931 26.2192C16.8721 26.9943 16.7069 27.8249 16.7069 28.6638C16.7069 29.5027 16.8721 30.3333 17.1931 31.1083C17.5142 31.8834 17.9847 32.5876 18.5779 33.1807C19.171 33.7739 19.8752 34.2444 20.6503 34.5655C21.4253 34.8865 22.2559 35.0517 23.0948 35.0517Z" fill="#B9C5CC"/>
                                        </svg>
                                        <label htmlFor="image" id="labelImage">
                                            <input type="file" name="image" id="image" onChange={(e) => onImageChange(e)} accept=".png, .jpg, .jpeg" />
                                            + Ajouter Photo
                                        </label>
                                        <div className="typeImage">jpg, png : 4mo max</div>
                                        </div>
                                    </div>
                                    <label htmlFor="title">Titre</label>
                                    <input type="text" name="title" id="title" value={titre} onChange={(e) => setTitre(e.target.value)}/>
                                    <label htmlFor="categories">Catégorie</label>
                                    <select name="categories" id="categories" value={categ} onChange={(e) => setCateg(e.target.value)}>
                                        {categories.map((category) => (
                                            <option key={category.name} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                            <div className="line2"></div>
                            {(addOk) && <div className="addOK"><p>Image ajoutée !</p></div>}
                            <button className="addPhoto2">Valider</button>
                        </form>
                        </div>
                    </div>
                </div>,
                // Puis je précise l'endroit ou j'inject
                document.body
            )}
            <section id="introduction">
                <figure>
                    <img src="/images/sophie-bluel.png" alt="" />
                </figure>
                <article>
                    <h2>Designer d'espace</h2>
                    <p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison
                        finale du chantier.</p>
                    <p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les
                        couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du
                        chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
                    <p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG,
                        décorateur(trice)</p>
                </article>
            </section>
            <section id="portfolio">
                <div className="titreModif">
                    <h2>Mes Projets</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" onClick={() => setModal(true)}>
                        <path d="M13.5229 1.68576L13.8939 2.05679C14.1821 2.34503 14.1821 2.81113 13.8939 3.0963L13.0016 3.99169L11.5879 2.57808L12.4803 1.68576C12.7685 1.39751 13.2346 1.39751 13.5198 1.68576H13.5229ZM6.43332 7.73578L10.5484 3.61759L11.9621 5.03121L7.84387 9.14633C7.75494 9.23525 7.64455 9.29964 7.52496 9.33337L5.73111 9.84546L6.2432 8.05162C6.27693 7.93203 6.34133 7.82164 6.43025 7.73271L6.43332 7.73578ZM11.4408 0.646245L5.39074 6.6932C5.12397 6.95998 4.93078 7.28808 4.82959 7.64685L3.9526 10.7133C3.879 10.9708 3.94953 11.2468 4.13965 11.4369C4.32977 11.627 4.60574 11.6976 4.86332 11.624L7.92973 10.747C8.29156 10.6427 8.61967 10.4495 8.88338 10.1858L14.9334 4.13888C15.7951 3.27722 15.7951 1.87894 14.9334 1.01728L14.5624 0.646245C13.7007 -0.215415 12.3024 -0.215415 11.4408 0.646245ZM2.69844 1.84214C1.20816 1.84214 0 3.05031 0 4.54058V12.8812C0 14.3715 1.20816 15.5796 2.69844 15.5796H11.0391C12.5293 15.5796 13.7375 14.3715 13.7375 12.8812V9.44683C13.7375 9.039 13.4094 8.71089 13.0016 8.71089C12.5937 8.71089 12.2656 9.039 12.2656 9.44683V12.8812C12.2656 13.5589 11.7167 14.1078 11.0391 14.1078H2.69844C2.02076 14.1078 1.47188 13.5589 1.47188 12.8812V4.54058C1.47188 3.86291 2.02076 3.31402 2.69844 3.31402H6.13281C6.54065 3.31402 6.86875 2.98591 6.86875 2.57808C6.86875 2.17025 6.54065 1.84214 6.13281 1.84214H2.69844Z" fill="black"/>
                    </svg>
                    <span onClick={() => setModal(true)}>modifier</span>
                </div>
                <div className="gallery">
                    {works.map((work) => (
                        <figure key={work.id}>
                            <img src={work.imageUrl} alt={work.title} />
                            <figcaption>{work.title}</figcaption>
                        </figure>
                    ))}
                </div>
            </section>
            <section id="contact">
                <h2>Contact</h2>
                <p>Vous avez un projet ? Discutons-en !</p>
                <form action="#" method="post">
                    <label htmlFor="name">Nom</label>
                    <input type="text" name="name" id="name" />
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" />
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message" cols="30" rows="10"></textarea>
                    <input type="submit" value="Envoyer" />
                </form>
            </section>
        </main>
    );
}

export default Admin;