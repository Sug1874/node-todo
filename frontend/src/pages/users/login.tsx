import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../../api"

const Login = () => {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const navigation = useNavigate()

    const handleSubmit = async(e: React.SyntheticEvent) => {
        e.preventDefault()
        if(userName.length <= 0 || password.length <= 0){
            alert("入力を完了してください")
            return
        }

        try{
            const result = await loginUser({user_name: userName, password: password})
            if(result == 200){
                navigation("/")
            }else if(result == 401){
                alert("ユーザー名かパスワードが間違っています")
            }else if(result == 500){
                alert("ログインに失敗しました。時間をおいてやり直してください。")
            }
        }catch(error){
            alert("ログインに失敗しました"+error)
        }
    }

    return (
        <div>
            <h1>ログイン</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" id="user_id" name="user_id" placeholder="ユーザー名" required 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setUserName(e.target.value)}}/>
                <input type="password" name="password" placeholder="パスワード" required 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPassword(e.target.value)}}/>
                <button type="submit">送信</button>
            </form>
            <a href="/user/register">登録画面</a>
        </div>
    )
}

export default Login