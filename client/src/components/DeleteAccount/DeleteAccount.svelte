<script>
    import { user } from "../../stores/userStore.js";
    import { toast } from "svelte-sonner";
    import { navigate } from "svelte-routing";

    async function handleDeleteAccount() {
        if (
            !confirm(
                "Are you sure you want to delete your account, all your scores will be deleted!",
            )
        ) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${$user.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const result = await response.json();

            user.set(null);

            navigate(`/`);
            toast.success(
                result?.data?.succesMessage ?? "User was deleted succesfully",
            );
        } catch (error) {
            toast.error(
                error?.data?.errorMessage ??
                    "Something went wrong while deleting account",
            );
        }
    }
</script>

<button onclick={handleDeleteAccount}>Delete my account!</button>

<style>
    button {
        font-weight: bolder;
        font-size: 1.5em;
        background-color: red;
    }
</style>
