interface UserInterface{
    access_token: string;
    client_token: string;
    uuid: string;
    name: string;
    meta: {
        [key: string]: any;
    },
    user_properties: {[key: string]: any};
}

export type { UserInterface }
