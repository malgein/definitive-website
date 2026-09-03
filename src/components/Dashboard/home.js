import { useRef } from 'react';
// import { auth, storage, db } from '../../firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { addDoc } from 'firebase/firestore';
// import { collection } from 'firebase/firestore/lite';

// 1. Install package
// Run this command to install the required dependencies.
// Details:
// npm install @supabase/supabase-js
// Code:
// File: Code
// ```
// npm install @supabase/supabase-js
// ```

// 2. Add files
// Add env variables, create a Supabase client, and use it in your app to query data.
// Code:
// File: .env.local
// ```
// REACT_APP_SUPABASE_URL=https://iitutngaepphdjmvhdiv.supabase.co
// REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_1yLggx-N4FMvk-1HyG2kZw_8p-HZpY1
// ```

// File: utils/supabase.ts
// ```
// 1import { createClient } from "@supabase/supabase-js";
// 2
// 3const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// 4const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;
// 5
// 6export const supabase = createClient(supabaseUrl, supabaseKey);
// ```

// File: App.tsx
// ```
// 1import { useState, useEffect } from 'react'
// 2import { supabase } from './utils/supabase'
// 3
// 4export default function App() {
// 5  const [todos, setTodos] = useState([])
// 6
// 7  useEffect(() => {
// 8    async function getTodos() {
// 9      const { data: todos } = await supabase.from('todos').select()
// 10
// 11      if (todos) {
// 12        setTodos(todos)
// 13      }
// 14    }
// 15
// 16    getTodos()
// 17  }, [])
// 18
// 19  return (
// 20    <ul>
// 21      {todos.map((todo) => (
// 22        <li key={todo.id}>{todo.name}</li>
// 23      ))}
// 24    </ul>
// 25  )
// 26}
// ```

// 3. Install Agent Skills (Optional)
// Agent Skills give AI coding tools ready-made instructions, scripts, and resources for working with Supabase more accurately and efficiently.
// Details:
// npx skills add supabase/agent-skills
// Code:
// File: Code
// ```
// npx skills add supabase/agent-skills

const Home = () => {
    const form = useRef();

    // const submitPortfolio = (e) => {
    //     e.preventDefault();
    //     const name = form.current[0]?.value;
    //     const description = form.current[1]?.value;
    //     const url = form.current[2]?.value;
    //     const image = form.current[3]?.files[0];
		// const code = form.current[4]?.value;

    //     const storageRef = ref(storage, `portfolio/${image.name}`);

    //     uploadBytes(storageRef, image).then(
    //         (snapshot) => {
    //             getDownloadURL(snapshot.ref).then((downloadUrl) => {
    //                 savePortfolio({
    //                     name,
    //                     description,
    //                     url,
    //                     image: downloadUrl,
		// 										code
    //                 })
    //             }, (error) => {
    //                 console.log(error);
    //                 savePortfolio({
    //                     name,
    //                     description,
    //                     url,
    //                     image: null,
		// 										code
    //                 })
    //             })
    //         }, (error) => {
    //             console.log(error);
    //             savePortfolio({
    //                 name,
    //                 description,
    //                 url,
    //                 image: null,
		// 								code
    //             })
    //         }
    //     )
    // }

    // const savePortfolio = async (portfolio) => {
    //     console.log(portfolio);
    //     try {
    //         await addDoc(collection(db, 'portfolio'), portfolio);
    //         window.location.reload(false);
    //     } catch (error) {
    //         alert('Failed to add portfolio');
    //     }
    // }

    return (
        <div className="dashboard">

            {/* <form ref={form} onSubmit={submitPortfolio}> */}
						<form ref={form} >
                <p><input type="text" placeholder="Name" /></p>
                <p><textarea placeholder="Description" /></p>
                <p><input type="text" placeholder="Url" /></p>
                <p><input type="file" placeholder="Image" /></p>
								<p><input type="text" placeholder="Code" /></p>
                <button type="submit">Submit</button>
                {/* <button onClick={() => auth.signOut()}>Sign out</button> */}
								<button >Sign out</button>
            </form>
        </div>
    )
}

export default Home;