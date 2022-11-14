import React, {useEffect} from "react"
import {Box, Button, Fade, Modal, Typography} from "@mui/material";
import {UpdateInfoType} from "../types/UpdateInfoType";
import {exposedFunctions} from "../utils/constants";
import parse from 'html-react-parser';

function UpdateInfo(){
    const [open, setOpen] = React.useState(false)
    const [updateInfo, setUpdateInfo] = React.useState<UpdateInfoType | null>(null)

    useEffect(() => {
        exposedFunctions("ipc").on("update:info", (_: any, updateInfo: UpdateInfoType) => setUpdateInfo(updateInfo))
        exposedFunctions("utils").checkForUpdates()
    }, [])
    useEffect(() => {
        setOpen(!!updateInfo)
    }, [updateInfo])

    return (
        <Modal
            disableEnforceFocus
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            componentsProps={{
                // ignoring since it's a bug in the typings
                // @ts-ignore
                backdrop: {timeout: 500}
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "90%",
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        outline: "none !important"
                    }}
                >
                    <Typography variant="h6" component="h2">
                        New Update Available: Version {updateInfo?.version}
                    </Typography>
                    <hr />
                    <Typography sx={{ mt: 2, mb: 6 }}>
                        {parse(updateInfo?.releaseNotes || "")}
                    </Typography>

                    <span className="text-info position-absolute start-0 ps-3">
                        The update will be downloaded in the background automatically.
                    </span>
                    <Button onClick={() => setOpen(false)} className="position-absolute end-0 me-3" sx={{bottom: "10px"}}>
                        Close
                    </Button>
                </Box>
            </Fade>
        </Modal>
    )
}

export default UpdateInfo
