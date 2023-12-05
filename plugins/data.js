export default async function({ app , redirect }) {
    let user = await app.$cookies.get('user');

    if(user && user.token != null){
      console.log("go")
    }else{
      redirect('/user/login');
    }
}