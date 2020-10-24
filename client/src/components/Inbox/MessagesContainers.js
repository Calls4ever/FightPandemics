import styled from "styled-components";
import { theme, mq } from "constants/theme";

export const BubbleContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  &.recipient {
    justify-content: flex-start;
  }
  small {
    position: relative;
    margin: 0 10px;
    top: 50%;
    font-style: italic;
  }
  &.is-editing {
    margin-bottom: 3rem;
    div {
      min-width: 40%;
    }
  }
  .edit-controls {
    position: absolute;
    bottom: -2.7rem;
    button {
      cursor: pointer;
      font-size: 1.3rem;
      background: none;
      color: #425af2;
      border: 1px solid #425af2;
      border-radius: 1.1rem;
      padding: 0.3rem 1rem;
      margin: 0 0.2rem;
      &.save {
        color: #fff;
        background: #425af2;
      }
    }
  }
`;
export const MessagesContainer = styled.div`
  width: 100%;
  height: calc(100% - 8em);
  min-height: 40%;
  padding: 1em;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  white-space: pre-wrap;
  @media screen and (max-width: ${mq.phone.wide.maxWidth}) {
    height: calc(100% - 4.5em);
    &.input-expanded {
      height: calc(100% - 8em);
    }
  }
  &.input-expanded {
    height: calc(100% - 12em);
  }
  a {
    text-decoration: underline;
    &:hover {
      color: inherit;
      opacity: 0.7;
    }
  }
  .load-more-btn {
    border: none;
    width: 100%;
    background: transparent;
    color: #425af2;
    padding: 5px;
    cursor: pointer;
  }
  small {
    opacity: 0.7;
  }
`;

export const SenderBubble = styled.div`
  position: relative;
  display: inline-block;
  max-width: 60%;
  background-color: #425af2;
  padding: 0.8em 0.1em 0.8em 0.1em;
  border-radius: 2em 2em 0.1em 2em;
  letter-spacing: 1px;
  margin-top: 1em;
  word-break: break-word;
  color: #fff;
  &:hover div:first-child,
  .ant-dropdown-open {
    display: block;
  }
  .message-content-sender {
    padding: 0em 1em 0em 1em;
  }
  textarea {
    position: absolute;
    resize: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 1em 1em 0.1em 1em;
    padding: 0.8em 1.1em 0.8em 1.1em;
    overflow: hidden;
    color: black;
  }
  &.deleted {
    opacity: 0.7;
    background: #fff;
    color: #969292;
    font-style: italic;
    border: 1px solid #969292;
  }
  @media screen and (max-width: ${mq.phone.wide.maxWidth}) {
    max-width: 70%;
  }
`;

export const RecipientBubble = styled.div`
  display: inline-block;
  max-width: 60%;
  background-color: #e6e4e6;
  padding: 0.8em 0.1em 0.8em 0.1em;
  border-radius: 0.1em 2em 2em 2em;
  letter-spacing: 1px;
  margin-top: 1em;
  word-break: break-word;
  .message-content-recipient {
    padding: 0em 1em 0em 1em;
  }
  &.deleted {
    opacity: 0.7;
    background: #fff;
    color: #969292;
    font-style: italic;
    border: 1px solid #969292;
  }
  @media screen and (max-width: ${mq.phone.wide.maxWidth}) {
    max-width: 70%;
  }
`;

export const TimeStamp = styled.small`
  color: #969292;
  padding: 2px 1rem;
  opacity: 1 !important;
  display: block;
  &.left {
    text-align: left;
  }
  &.right {
    text-align: right;
  }
`;

export const MessageMenu = styled.div`
  position: absolute;
  display: none;
  background: #ffffff;
  width: 3.5rem;
  height: 1.75rem;
  right: 0.8rem;
  top: -0.8rem;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 10px 0 #0000002e;
  img {
    width: 70%;
    opacity: 0.4;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;