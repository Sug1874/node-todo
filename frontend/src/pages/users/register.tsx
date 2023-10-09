import { useState } from "react"
import { registerUser } from "../../api"
import { useNavigate } from "react-router-dom"

const Register = () => {

    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const navigation = useNavigate()

    const handleSubmit = async(e: React.SyntheticEvent) => {
        e.preventDefault()
        if(userName.length <= 0){
            alert("ユーザーネームを入力してください")
            return
        }
        if(password.length < 8){
            alert("パスワードは８文字以上で設定してください")
            return
        }
        if(password != passwordConfirm){
            alert("確認用パスワードが間違っています")
            return
        }

        try{
            const result = await registerUser({user_name: userName, password: password})
            if(result == 200){
                navigation("/user/login")
            }else if(result == 400){
                alert("使えないユーザー名です")
            }else if(result == 500){
                alert("ユーザー登録に失敗しました。時間をおいてやり直してください。")
            }
        }catch(error){
            alert("ユーザー登録に失敗しました")
        }
    }

    return (
        <div className="login_content">
            <h1>ユーザー登録</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="user_id" placeholder="ユーザー名" required 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setUserName(e.target.value)}}/>
                <input type="password" name="password" placeholder="パスワード" required 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPassword(e.target.value)}}/>
                <input type="password" name="password_confirm" placeholder="確認用パスワード" required 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPasswordConfirm(e.target.value)}}/>
                <button type="submit">送信</button>
            </form>
            <a href="/user/login">ログイン画面</a>
        </div>
    )
}

export default Register