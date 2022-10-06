import React, {useEffect} from "react"
import {Box, Slide, ThemeProvider} from "@mui/material";
import defaultTheme from "./themes/defaultTheme";
import Sidebar from "./components/Sidebar";
import pageMapping, {loadModPacks, pageMappingInterface} from "./pages/pageMapping";
import {getSetting} from "./utils/settings";
import Login from "./pages/other/Login";
import UserDropdown from "./components/UserDropdown";
import {UserInterface} from "./types/userInterface";
import LaunchBarPane from "./components/LaunchBarPane";
import LaunchProgressPane from "./components/LaunchProgressPane";


function App(){
    const [actionsDisabled, setActionsDisabled] = React.useState<boolean>(false)
    const [launching, setLaunching] = React.useState<boolean>(false)

    const [userData, setUserData] = React.useState<UserInterface | null | undefined>(undefined);
    const [modPacks, setModPacks] = React.useState<pageMappingInterface | null>(null)
    const [page, setPage] = React.useState<string>("overview")

    useEffect(() => {
        loadModPacks().then(setModPacks)
    }, [])

    useEffect(() => {
        window.addEventListener("popstate", () => {
            setPage(window.location.search.substring(1))
        })
        getSetting("credentials").then(setUserData)
    }, [])
    useEffect(() => {
        if(window.location.search.substring(1) === page) return
        history.pushState(
            null,
            pageMapping[page] ? pageMapping[page].name : "Mod pack page",
            pageMapping[page] ? pageMapping[page].path : modPacks![page].path
        )
    }, [page])

    return (
        <ThemeProvider theme={defaultTheme}>
            {userData && <UserDropdown
                user={userData}
                pageChange={setPage}
                userDataChange={setUserData}
                disabled={actionsDisabled}
            />}
            {userData === null ? (
                <Login pageChange={setPage} userDataChange={setUserData} />
            ) : (
                userData ? (
                    <Box display="flex" sx={{height: "100%"}}>
                        <Sidebar
                            page={page}
                            pageChange={setPage}
                            modPacks={modPacks}
                            disableSidebar={actionsDisabled}
                        />

                        {pageMapping[page] ? pageMapping[page].component : modPacks![page].component}

                        <Slide in={pageMapping[page] ? !!pageMapping[page].launchBar : !!modPacks![page].launchBar} direction="up">
                            <div className="launch-pane-container">
                                <LaunchBarPane
                                    children={pageMapping[page] ? pageMapping[page].launchBar : modPacks![page].launchBar}
                                    disabled={actionsDisabled}
                                />
                            </div>
                        </Slide>

                        <Slide in={launching} direction="up">
                            <div className="launch-progress-container">
                                <LaunchProgressPane setDisabled={setActionsDisabled} />
                            </div>
                        </Slide>

                    </Box>
                ) : <></>
            )}
        </ThemeProvider>
    )
}

export default App;
