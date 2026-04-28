<script>
  import { fetchPost, fetchGet } from "../../util/fetchUtil.js";
  import { toast } from "svelte-sonner";
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";

  let username = "";
  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let countryId = "";
  let submitted = false;

  let countries = [];

  async function handleSubmit(event) {
    event.preventDefault();
    submitted = true;
    try {
      const result = await fetchPost("/auth/register", {
        username,
        name,
        email,
        password1: password,
        password2: confirmPassword,
        countryId
      });
      toast.success(result.data.successMessage);
      navigate("/login");
    } catch (error) {
      submitted = false;
      toast.error(error.data.errorMessage);
    }
  }

  onMount(async () => {
    try {
      const result = await fetchGet("/api/countries");

      
      countries = result.data.countries;
    } catch (error) {
      console.log()
      toast.error(error.data.errorMessage);
    }
  });
</script>

<section aria-labelledby="register-heading">
  <header>
    <h1 id="register-heading">Create account</h1>
    <p>Sign up to get started</p>
  </header>

  <form onsubmit={handleSubmit}>
    <label for="username">Username</label>
    <input
      id="username"
      type="text"
      bind:value={username}
      placeholder="gustavo1969"
      required
    />

    <label for="country">Country</label>
    <select bind:value={countryId} required name="country_id" id="country">
      {#each countries as country}
        <option value={country.id}>
          {country.name}
        </option>
      {/each}
    </select>

    <label for="name">name</label>
    <input
      id="name"
      type="text"
      bind:value={name}
      placeholder="Gustavo"
      required
    />

    <label for="email">Email</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      placeholder="gustavo@roque.com"
      required
    />

    <label for="password">Password</label>
    <input id="password" type="password" bind:value={password} required />

    <label for="confirm-password">Confirm password</label>
    <input
      id="confirm-password"
      type="password"
      bind:value={confirmPassword}
      required
    />

    <button type="submit">
      {submitted ? "Creating account…" : "Create account"}
    </button>
  </form>
</section>
