import { useState } from "react"

const Register = () => {

    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if(userName.length <= 0){
            alert("ユーザーネームを登録してください")
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
            
        }catch(error){
            alert("ユーザ登録に失敗しました")
        }
    }

    return (
        <div>
            <h1>ユーザー登録</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="user_id" value="user_id" placeholder="ユーザーID" required 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setUserName(e.target.value)}}/>
                <input type="password" name="password" value="password" placeholder="パスワード" required 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPassword(e.target.value)}}/>
                <input type="password" name="password_confirm" value="password_confirm" placeholder="パスワードの確認" required 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setPasswordConfirm(e.target.value)}}/>
            </form>
        </div>
    )
}

export default Register