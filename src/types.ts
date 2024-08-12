export class StoredMessage {
  id: string;
  message: string;
  date: Date;
  user: string;
  channel: string;
  streamId?: string;
  upTime?: number;

  constructor(
    id: string,
    message: string,
    date: Date,
    user: string,
    channel: string,
    streamId?: string,
    streamStart?: Date
  ) {
    this.id = id;
    this.message = message;
    this.date = date;
    this.user = user;
    this.channel = channel;
    this.streamId = streamId ? streamId : null;
    streamStart
      ? (this.upTime = streamStart.getMilliseconds() - date.getMilliseconds())
      : (this.upTime = 0);
  }
}

export class ChannelAllMsg {
  channel: string;
  chatMsg: StoredMessage[];
  removedMsg: StoredMessage[];

  constructor(channel: string) {
    this.channel = channel;
    this.chatMsg = [];
    this.removedMsg = [];
  }
}
