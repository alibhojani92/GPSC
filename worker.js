export default {
  fetch(request, env, ctx) {
    return new Response(
      "GPSC Dental V1 – Worker is LIVE ✅",
      {
        headers: {
          "content-type": "text/plain; charset=UTF-8"
        }
      }
    );
  }
};
