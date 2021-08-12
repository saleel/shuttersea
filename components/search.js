import React from 'react';
import { useRouter } from 'next/router';

export default function Search(props) {
  const [keyword, setKeyword] = React.useState(props.keyword);
  const router = useRouter();

  return (
    <form className="search" onSubmit={() => { router.push(`/search/${keyword}`); }}>
      <div className="control has-icons-left has-icons-right">
        <input
          className={`input is-rounded ${(props.large ? 'is-medium' : '')}`}
          type="text"
          placeholder="Search for royalty-free stock photos"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-search" />
        </span>
      </div>
    </form>
  );
}
