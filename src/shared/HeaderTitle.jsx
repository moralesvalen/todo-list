import styled from 'styled-components';

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  margin: 0;
`;

const TitleIcon = styled.svg`
  width: 1.6rem;
  height: 1.6rem;
  stroke: currentColor;
  fill: none;
`;

export default function HeaderTitle({ className, children = 'My Todos' }) {
  return (
    <Title className={className}>
      <TitleIcon viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="4"
          ry="4"
          strokeWidth="2"
        />
        <path d="M7 12.5l3.5 3.5L17 9" strokeWidth="2.4" />
      </TitleIcon>
      {children}
    </Title>
  );
}
