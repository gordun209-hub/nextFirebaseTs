import kebabCase from 'lodash.kebabcase'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import toast from 'react-hot-toast'

import AuthCheck from '../../components/AuthCheck'
import PostFeed from '../../components/PostFeed'
import { UserContext } from '../../lib/context'
import { auth, firestore, serverTimestamp } from '../../lib/firebase'
import styles from '../../styles/Admin.module.css'

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map(doc => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed admin posts={posts} />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  // Create a new post in firestore
  const createPost = async e => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(slug)

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0
    }

    await ref.set(data)

    toast.success('Post created!')

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        placeholder='My Awesome Article!'
        className={styles.input}
        onChange={e => setTitle(e.target.value)}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create New Post
      </button>
    </form>
  )
}
