import { handleStart } from "./services/user.service";

export async function handleUpdate(update, env) {
  if (update.message?.text === "/start") {
    return await handleStart(update, env);
  }

  return new Response("Ignored 🤷‍♂️");
}
