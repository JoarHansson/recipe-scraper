type Props = {
  url: string | undefined;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
};

export const Form = ({ url, handleInputChange, handleSubmit }: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="urlInput">Paste your url here</label>
        <input
          value={url || ""}
          onChange={handleInputChange}
          id="urlInput"
          type="url"
          placeholder="https://www.recipe.com"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
