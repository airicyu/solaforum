export declare type Solaforum = {
    version: '0.1.0'
    name: 'solaforum'
    instructions: [
        {
            name: 'initialize'
            accounts: [
                {
                    name: 'signer'
                    isMut: true
                    isSigner: true
                },
                {
                    name: 'earthIdCounter'
                    isMut: true
                    isSigner: false
                },
                {
                    name: 'systemProgram'
                    isMut: false
                    isSigner: false
                },
            ]
            args: []
        },
        {
            name: 'createEarth'
            accounts: [
                {
                    name: 'signer'
                    isMut: true
                    isSigner: true
                },
                {
                    name: 'earthIdCounter'
                    isMut: true
                    isSigner: false
                },
                {
                    name: 'earth'
                    isMut: true
                    isSigner: false
                },
                {
                    name: 'systemProgram'
                    isMut: false
                    isSigner: false
                },
            ]
            args: [
                {
                    name: 'data'
                    type: {
                        defined: 'CreateEarthData'
                    }
                },
            ]
        },
        {
            name: 'initializeUser'
            accounts: [
                {
                    name: 'signer'
                    isMut: true
                    isSigner: true
                },
                {
                    name: 'user'
                    isMut: true
                    isSigner: false
                },
                {
                    name: 'systemProgram'
                    isMut: false
                    isSigner: false
                },
            ]
            args: [
                {
                    name: 'data'
                    type: {
                        defined: 'InitUserData'
                    }
                },
            ]
        },
        {
            name: 'createPost'
            accounts: [
                {
                    name: 'signer'
                    isMut: true
                    isSigner: true
                },
                {
                    name: 'earth'
                    isMut: true
                    isSigner: false
                },
                {
                    name: 'creator'
                    isMut: true
                    isSigner: false
                },
                {
                    name: 'post'
                    isMut: true
                    isSigner: false
                },
                {
                    name: 'systemProgram'
                    isMut: false
                    isSigner: false
                },
            ]
            args: [
                {
                    name: 'data'
                    type: {
                        defined: 'CreatePostData'
                    }
                },
            ]
        },
        {
            name: 'createReply'
            accounts: [
                {
                    name: 'signer'
                    isMut: true
                    isSigner: true
                },
                {
                    name: 'post'
                    isMut: true
                    isSigner: false
                },
                {
                    name: 'systemProgram'
                    isMut: false
                    isSigner: false
                },
            ]
            args: [
                {
                    name: 'data'
                    type: {
                        defined: 'CreateReplyData'
                    }
                },
            ]
        },
    ]
    accounts: [
        {
            name: 'earth'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'creator'
                        type: 'publicKey'
                    },
                    {
                        name: 'id'
                        type: 'u64'
                    },
                    {
                        name: 'earthPostNextId'
                        type: 'u64'
                    },
                    {
                        name: 'name'
                        type: 'string'
                    },
                ]
            }
        },
        {
            name: 'user'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'userPostNextId'
                        type: 'u64'
                    },
                    {
                        name: 'name'
                        type: 'string'
                    },
                ]
            }
        },
        {
            name: 'post'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'replyNextId'
                        type: 'u8'
                    },
                    {
                        name: 'createdTime'
                        type: 'i64'
                    },
                    {
                        name: 'lastReplyTime'
                        type: 'i64'
                    },
                ]
            }
        },
        {
            name: 'createEarthData'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'earthId'
                        type: 'u64'
                    },
                    {
                        name: 'name'
                        type: 'string'
                    },
                ]
            }
        },
        {
            name: 'initUserData'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'name'
                        type: 'string'
                    },
                ]
            }
        },
        {
            name: 'createPostData'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'earthId'
                        type: 'u64'
                    },
                    {
                        name: 'title'
                        type: 'string'
                    },
                    {
                        name: 'content'
                        type: 'string'
                    },
                ]
            }
        },
        {
            name: 'createReplyData'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'postCreator'
                        type: 'publicKey'
                    },
                    {
                        name: 'userPostId'
                        type: 'u64'
                    },
                    {
                        name: 'content'
                        type: 'string'
                    },
                ]
            }
        },
        {
            name: 'u64IdCounter'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'nextId'
                        type: 'u64'
                    },
                ]
            }
        },
        {
            name: 'u8IdCounter'
            type: {
                kind: 'struct'
                fields: [
                    {
                        name: 'nextId'
                        type: 'u8'
                    },
                ]
            }
        },
    ]
}

export const IDL: Solaforum = {
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
            name: 'earth',
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
            name: 'user',
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
            name: 'post',
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
            name: 'createEarthData',
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
            name: 'initUserData',
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
            name: 'createPostData',
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
            name: 'createReplyData',
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
            name: 'u64IdCounter',
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
            name: 'u8IdCounter',
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
