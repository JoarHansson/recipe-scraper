type Props = {
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
};

export const Form = ({ handleInputChange, handleSubmit }: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="urlInput">Paste your url here</label>
        <input onChange={handleInputChange} id="urlInput" type="text" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
