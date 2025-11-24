export default function AwaitingApproval() {
  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 16 }}>
      <h1>Account pending approval</h1>
      <p>Your account was created and awaits administrator approval. You will be able to sign in once approved.</p>
      <p><a href="/login">Back to login</a></p>
    </div>
  );
}
