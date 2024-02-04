export type ServerDto = {
  success: boolean;
  result: { message: string };
};

export type PackedMessage = {
  success: boolean;
  serverMessage: string;
};

export class MessagePacking {
  static unpackServerDtoToPm = (dto: ServerDto): PackedMessage => {
    return { success: dto.success, serverMessage: dto.result.message };
  };
}
