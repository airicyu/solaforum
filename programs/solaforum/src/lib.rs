use anchor_lang::{prelude::*, solana_program::clock};

declare_id!("4HeVTFdGHgSzjmexn7k1zpJxFsBymJ7FcpwJzGARvswN");

#[program]
pub mod solaforum {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let earth_id_counter = &mut ctx.accounts.earth_id_counter;
        earth_id_counter.next_id = 1;
        Ok(())
    }

    pub fn create_earth(ctx: Context<CreateEarth>, data: CreateEarthData) -> Result<()> {
        if data.name.as_bytes().len() > 30 {
            msg!("Name too long.");
            panic!();
        }

        if data.earth_id != ctx.accounts.earth_id_counter.next_id {
            msg!("Invalid Earth ID.");
            panic!();
        }

        // construct Earth
        let earth = &mut ctx.accounts.earth;
        earth.id = data.earth_id;
        earth.name = data.name;
        earth.earth_post_next_id = 1;

        msg!("Created Earth. Id: {}, name: {}", earth.id, earth.name);
        Ok(())
    }

    pub fn initialize_user(ctx: Context<InitializeUser>, data: InitUserData) -> Result<()> {
        msg!("initialize_user");

        if data.name.as_bytes().len() > 30 {
            msg!("Name too long.");
            panic!();
        }

        let user = &mut ctx.accounts.user;
        user.name = data.name;
        user.user_post_next_id = 1;

        msg!(
            "Initialized user. user: {}, name: {}",
            ctx.accounts.signer.key,
            user.name
        );
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, data: CreatePostData) -> Result<()> {
        if data.title.as_bytes().len() > 50 {
            msg!("Title too long.");
            panic!();
        }
        if data.content.as_bytes().len() > 255 {
            msg!("Content too long.");
            panic!();
        }

        let earth = &mut ctx.accounts.earth;
        earth.earth_post_next_id += 1;

        let creator = &mut ctx.accounts.creator;
        creator.user_post_next_id += 1;

        // construct Post
        let post = &mut ctx.accounts.post;
        post.reply_next_id = 1;

        post.created_time = clock::Clock::get()?.unix_timestamp;

        post.last_reply_time = 0;

        msg!("Created Post.");
        msg!("Creator: {}", ctx.accounts.signer.key());
        msg!("Earth ID: {}", data.earth_id);
        msg!("Earth Post ID: {}", earth.earth_post_next_id - 1);
        msg!("User Post ID: {}", creator.user_post_next_id - 1);
        msg!("Post title: {}", data.title);
        msg!("Post content: {}", data.content);
        msg!("Post time: {}", post.created_time);

        Ok(())
    }

    pub fn create_reply(ctx: Context<CreateReply>, data: CreateReplyData) -> Result<()> {
        if data.content.as_bytes().len() > 255 {
            msg!("Content too long.");
            panic!();
        }

        // construct Post
        let post = &mut ctx.accounts.post;

        if post.reply_next_id >= 255 {
            msg!("No more reply allowed for this post!");
            panic!();
        }

        post.reply_next_id += 1;

        let now = clock::Clock::get()?.unix_timestamp;
        post.last_reply_time = now;

        msg!("Created Post Reply.");
        msg!("Post creater: {}", data.post_creator);
        msg!("User Post ID: {}", data.user_post_id);
        msg!("Reply ID: {}", ctx.accounts.post.reply_next_id - 1);
        msg!("Reply user: {}", ctx.accounts.signer.key());
        msg!("Reply content: {}", data.content);
        msg!("Reply time: {}", now);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init, payer = signer, space = 8+8,
        seeds = [b"earth_id_counter"], bump
    )]
    pub earth_id_counter: Account<'info, U64IdCounter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: CreateEarthData)]
pub struct CreateEarth<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut, seeds = [b"earth_id_counter"], bump
    )]
    pub earth_id_counter: Account<'info, U64IdCounter>,

    #[account(
        init, payer = signer, space = 8+32+8+8+4+30,
        constraint = data.earth_id == earth_id_counter.next_id,
        seeds = [b"earth".as_ref(), &data.earth_id.to_le_bytes()], bump
    )]
    pub earth: Account<'info, Earth>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: InitUserData)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer,
        space = 8+4+20,
        seeds = [b"user".as_ref(), signer.key().as_ref()], bump)]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: CreatePostData)]
pub struct CreatePost<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [b"earth".as_ref(), &data.earth_id.to_le_bytes()], bump)]
    pub earth: Account<'info, Earth>,

    #[account(mut, seeds = [b"user".as_ref(), signer.key().as_ref()], bump)]
    pub creator: Account<'info, User>,

    #[account(
        init, payer = signer, space = 8+1+8+8,
        seeds = [b"user_post".as_ref(), signer.key().as_ref(), &creator.user_post_next_id.to_le_bytes()], bump
    )]
    pub post: Account<'info, Post>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: CreateReplyData)]
pub struct CreateReply<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [b"user_post".as_ref(), data.post_creator.key().as_ref(), &data.user_post_id.to_le_bytes()], bump)]
    pub post: Account<'info, Post>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Earth {
    creator: Pubkey,
    id: u64,
    earth_post_next_id: u64,
    name: String, // max size=30
}

#[account]
pub struct User {
    user_post_next_id: u64,
    name: String, //max size=20
}

#[account]
pub struct Post {
    // creator: Pubkey,
    // earth id <- trx query sign for post_counter
    // post id
    reply_next_id: u8,
    created_time: i64,
    last_reply_time: i64,
}

#[account]
pub struct CreateEarthData {
    earth_id: u64,
    name: String, // max size = 30
}

#[account]
pub struct InitUserData {
    name: String, // max size = 20
}

#[account]
pub struct CreatePostData {
    earth_id: u64,
    title: String,   // max size = 50
    content: String, // max size = 255
}

#[account]
pub struct CreateReplyData {
    post_creator: Pubkey,
    user_post_id: u64,
    content: String, // max size = 255
}

#[account]
pub struct U64IdCounter {
    next_id: u64,
}

#[account]
pub struct U8IdCounter {
    next_id: u8,
}
