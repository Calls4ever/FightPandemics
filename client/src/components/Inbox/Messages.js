import React, { useRef, useLayoutEffect } from "react";
import { Menu, Dropdown, Typography } from "antd";
import {
  BubbleContainer,
  MessagesContainer,
  MessageMenu,
  SenderBubble,
  RecipientBubble,
  TimeStamp,
} from "./MessagesContainers";
import { OrgPost } from "./OrgPost";
import getRelativeTime from "utils/relativeTime";
import moment from "moment";
import subMenuIcon from "assets/icons/submenu.svg";
import { mq } from "constants/theme";
import { AlertBox } from "./AlertBox";
const { Text } = Typography;

const GROUP_MESSAGES_TIME_FRAME = 3; // minutes

const Messages = ({
  setText,
  user,
  room,
  chatLog,
  deleteMessage,
  editMessage,
  onLoadMoreClick,
  toggleViewRequests,
  editingMessageId,
  setEditingMessageId,
  getScrollToBottom,
  isLoading,
  inputExpanded,
}) => {
  const messagesEndRef = useRef(null);
  const editTextArea = useRef();
  const [alertBoxData, setAlertBox] = React.useState({});

  const scrollToBottom = React.useCallback(() => {
    const element = messagesEndRef.current;
    if (element) {
      element.scrollTo(0, element?.scrollHeight);
    }
  }, []);

  React.useEffect(() => {
    getScrollToBottom.current = scrollToBottom;
  }, [getScrollToBottom, scrollToBottom]);

  const isMobile = () => {
    return window.screen.width <= parseInt(mq.phone.wide.maxWidth);
  };

  const linkify = (text) => {
    let urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    function urlify(text) {
      if (urlRegex.test(text))
        return (
          <a
            target="_blank"
            key={Math.random().toString(36)}
            href={`${text.startsWith("http") ? "" : "//"}${text}`}
          >
            {text}
          </a>
        );
      else return text;
    }
    let output = [];
    text.split(/(\s+)/).forEach((word) => {
      output.push(urlify(word));
    });
    return output;
  };

  // messages time grouping
  const shouldShowTime = (messageIndex) => {
    // this order is important
    // always show time for latest one
    if (!chatLog[messageIndex + 1]) return true;
    if (
      !chatLog[messageIndex + 1] &&
      moment().diff(chatLog[messageIndex].createdAt, "minutes") <=
        GROUP_MESSAGES_TIME_FRAME
    )
      return false;
    if (chatLog[messageIndex].authorId !== chatLog[messageIndex + 1]?.authorId)
      return true;
    return (
      moment(chatLog[messageIndex + 1].createdAt).diff(
        chatLog[messageIndex].createdAt,
        "minutes",
      ) >= GROUP_MESSAGES_TIME_FRAME
    );
  };

  const isToday = (date) => {
    return moment(date).isSame(moment(), "day");
  };

  function showDeleteConfirm(messageId) {
    setAlertBox({
      show: true,
      title: "Delete the message?",
      content:
        "The selected message will be permanently deleted from both you and the recipent's devices. Are you sure you want to delete?",
      action: [
        {
          text: <Text type="danger">Delete</Text>,
          onPress: () => {
            deleteMessage(messageId);
            setAlertBox({ show: false });
          },
        },
        { text: "Cancel", onPress: () => setAlertBox({ show: false }) },
      ],
    });
  }

  function startMessageEditing(messageId, content) {
    setEditingMessageId(messageId);
    if (isMobile()) setText(content);
  }

  function cancelMessageEditing() {
    setEditingMessageId(null);
  }

  function saveMessageEditing(messageId) {
    if (!editTextArea.current.value.replace(/\s/g, ""))
      return cancelMessageEditing();
    editMessage({ messageId, newContent: editTextArea.current.value });
    setEditingMessageId(null);
  }

  const menu = (messageId, content) => (
    <Menu key={"menu-" + messageId}>
      {
        <Menu.Item onClick={() => startMessageEditing(messageId, content)}>
          Edit
        </Menu.Item>
      }
      <Menu.Item onClick={() => showDeleteConfirm(messageId)} danger>
        Delete
      </Menu.Item>
    </Menu>
  );

  const Sender = ({ postRef, message, messageId, isDeleted, isEdited }) => {
    return (
      <BubbleContainer
        className={`${editingMessageId === messageId ? "is-editing" : ""}`}
        key={"b-" + messageId}
      >
        {isEdited && <small>Edited</small>}
        <SenderBubble className={`${isDeleted ? "deleted" : ""}`}>
          {!isDeleted && editingMessageId !== messageId && (
            <Dropdown
              overlay={menu(messageId, message)}
              placement="bottomRight"
            >
              <MessageMenu>
                <img src={subMenuIcon} />
              </MessageMenu>
            </Dropdown>
          )}
          {postRef && !(!isMobile() && editingMessageId === messageId) && (
            <OrgPost postRef={postRef} />
          )}
          <div className="message-content-sender">
            {!isDeleted && message
              ? linkify(message)
              : "You deleted this message."}
          </div>
          {!isMobile() && editingMessageId === messageId && (
            <textarea
              key={"t-area-" + messageId}
              ref={editTextArea}
              defaultValue={message}
              maxlength={2048}
            ></textarea>
          )}
        </SenderBubble>
        {!isMobile() && editingMessageId === messageId && (
          <div key={"m-edit-" + messageId} className={"edit-controls"}>
            <button onClick={() => cancelMessageEditing()}>Cancel</button>
            <button
              className={"save"}
              onClick={() => saveMessageEditing(messageId)}
            >
              Save changes
            </button>
          </div>
        )}
      </BubbleContainer>
    );
  };
  const Recipient = ({ postRef, message, messageId, isDeleted, isEdited }) => {
    return (
      <BubbleContainer className={"recipient"} key={"b-" + messageId}>
        <RecipientBubble
          key={"b-" + messageId}
          className={`${isDeleted ? "deleted" : ""}`}
        >
          {postRef && <OrgPost postRef={postRef} />}
          <div className="message-content-recipient">
            {!isDeleted && message
              ? linkify(message)
              : "This message was deleted."}
          </div>
        </RecipientBubble>
        {isEdited && <small>Edited</small>}
      </BubbleContainer>
    );
  };

  useLayoutEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    }
  }, [room, chatLog.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MessagesContainer
      ref={messagesEndRef}
      className={`${toggleViewRequests ? "request-page" : ""} ${
        inputExpanded ? "input-expanded" : ""
      }`}
    >
      {alertBoxData?.show && (
        <AlertBox
          footer={alertBoxData?.action}
          visible={alertBoxData?.show}
          transparent
          title={alertBoxData?.title}
        >
          {alertBoxData?.content}
        </AlertBox>
      )}
      {!isLoading && room && chatLog.length >= 20 && !room.loadedAll && (
        <button onClick={onLoadMoreClick} className={"load-more-btn"}>
          Load more...
        </button>
      )}
      {chatLog?.map((message, i) => (
        <>
          {message.authorId !== user.id ? (
            <Recipient
              key={message._id}
              message={message.content}
              postRef={message.postRef}
              messageId={message._id}
              isDeleted={message.status === "deleted"}
              isEdited={message.status === "edited"}
            />
          ) : (
            <Sender
              key={message._id}
              message={message.content}
              postRef={message.postRef}
              messageId={message._id}
              isDeleted={message.status === "deleted"}
              isEdited={message.status === "edited"}
            />
          )}
          {shouldShowTime(i) && (
            <TimeStamp
              key={"t-" + message._id}
              className={message.authorId !== user.id ? "left" : "right"}
            >
              {isToday(message.createdAt)
                ? getRelativeTime(message.createdAt)
                : moment(message.createdAt).format("ddd MMM. DD, HH:mm")}
            </TimeStamp>
          )}
        </>
      ))}
      {/* <div ref={messagesEndRef} id={"messages-bottom"}></div> */}
    </MessagesContainer>
  );
};
export default Messages;
