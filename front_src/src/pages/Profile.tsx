import React from "react"
import PageBase from "./PageBase";
import {UserInterface} from "../types/userInterface";
import {getSetting} from "../utils/settings";

function Profile(){
    const [userData, setUserData] = React.useState<UserInterface | null>(null)

    React.useEffect(() => {
        getSetting("credentials").then(setUserData)
    }, [])

    return (
        <PageBase>
            <div className="mt-5 text-center">
                <h1 className="text-3xl font-bold">{userData?.name}</h1>
                {userData && <img src={`https://crafatar.com/renders/body/${userData.uuid}?overlay&scale=10`} alt={userData.name} />}
            </div>
        </PageBase>
    )
}

export default Profile
