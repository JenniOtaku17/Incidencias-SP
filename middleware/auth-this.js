export default async function({ app, redirect }) {
    let user = await app.$cookies.get('user');

    if(user && user.token != null){
        //store.commit('userManager/setUser', user);
        console.log("go")
    }else{
      redirect('/user/login');
    }

}