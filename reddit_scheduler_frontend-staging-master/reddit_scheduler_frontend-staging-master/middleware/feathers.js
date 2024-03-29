export default function ({ store, redirect, route }) {
  const { auth } = store.state
  if (auth.publicPages.length > 0 && !auth.publicPages.includes(route.name) && !auth.payload) {
    return redirect('/');
  } else if (auth.publicPages.length > 0 && auth.publicPages.includes(route.name) && auth.payload) {
    return redirect('/posts');
  }
}
