import { useRef } from 'react';
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore/lite';


const Home = () => {
    const form = useRef();

    const submitPortfolio = (e) => {
        e.preventDefault();
        const name = form.current[0]?.value;
        const description = form.current[1]?.value;
        const url = form.current[2]?.value;
        const image = form.current[3]?.files[0];
		const code = form.current[4]?.value;

        const storageRef = ref(storage, `portfolio/${image.name}`);

        uploadBytes(storageRef, image).then(
            (snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadUrl) => {
                    savePortfolio({
                        name,
                        description,
                        url,
                        image: downloadUrl,
												code
                    })
                }, (error) => {
                    console.log(error);
                    savePortfolio({
                        name,
                        description,
                        url,
                        image: null,
												code
                    })
                })
            }, (error) => {
                console.log(error);
                savePortfolio({
                    name,
                    description,
                    url,
                    image: null,
										code
                })
            }
        )
    }

    const savePortfolio = async (portfolio) => {
        console.log(portfolio);
        try {
            await addDoc(collection(db, 'portfolio'), portfolio);
            window.location.reload(false);
        } catch (error) {
            alert('Failed to add portfolio');
        }
    }

    return (
        <div className="dashboard">

            <form ref={form} onSubmit={submitPortfolio}>
                <p><input type="text" placeholder="Name" /></p>
                <p><textarea placeholder="Description" /></p>
                <p><input type="text" placeholder="Url" /></p>
                <p><input type="file" placeholder="Image" /></p>
								<p><input type="text" placeholder="Code" /></p>
                <button type="submit">Submit</button>
                <button onClick={() => auth.signOut()}>Sign out</button>
            </form>
        </div>
    )
}

export default Home;