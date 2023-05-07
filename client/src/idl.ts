export const idl = {
    version: '0.1.0',
    name: 'solaforum',
    instructions: [
        {
            name: 'initialize',
            accounts: [
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'earthIdCounter',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
        {
            name: 'createEarth',
            accounts: [
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'earthIdCounter',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'earth',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'data',
                    type: {
                        defined: 'CreateEarthData',
                    },
                },
            ],
        },
        {
            name: 'initializeUser',
            accounts: [
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'user',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'data',
                    type: {
                        defined: 'InitUserData',
                    },
                },
            ],
        },
        {
            name: 'createPost',
            accounts: [
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'earth',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'creator',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'post',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'data',
                    type: {
                        defined: 'CreatePostData',
                    },
                },
            ],
        },
        {
            name: 'createReply',
            accounts: [
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'post',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'data',
                    type: {
                        defined: 'CreateReplyData',
                    },
                },
            ],
        },
    ],
    accounts: [
        {
            name: 'Earth',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'creator',
                        type: 'publicKey',
                    },
                    {
                        name: 'id',
                        type: 'u64',
                    },
                    {
                        name: 'earthPostNextId',
                        type: 'u64',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                ],
            },
        },
        {
            name: 'User',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'userPostNextId',
                        type: 'u64',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                ],
            },
        },
        {
            name: 'Post',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'replyNextId',
                        type: 'u8',
                    },
                    {
                        name: 'createdTime',
                        type: 'i64',
                    },
                    {
                        name: 'lastReplyTime',
                        type: 'i64',
                    },
                ],
            },
        },
        {
            name: 'CreateEarthData',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'earthId',
                        type: 'u64',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                ],
            },
        },
        {
            name: 'InitUserData',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'name',
                        type: 'string',
                    },
                ],
            },
        },
        {
            name: 'CreatePostData',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'earthId',
                        type: 'u64',
                    },
                    {
                        name: 'title',
                        type: 'string',
                    },
                    {
                        name: 'content',
                        type: 'string',
                    },
                ],
            },
        },
        {
            name: 'CreateReplyData',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'postCreator',
                        type: 'publicKey',
                    },
                    {
                        name: 'userPostId',
                        type: 'u64',
                    },
                    {
                        name: 'content',
                        type: 'string',
                    },
                ],
            },
        },
        {
            name: 'U64IdCounter',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'nextId',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'U8IdCounter',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'nextId',
                        type: 'u8',
                    },
                ],
            },
        },
    ],
}
