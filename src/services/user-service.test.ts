import userService from "../services/user-service";
import userRepository from "../repositories/user-repository";
import { hashPassword } from "../utils/password";
import { userBaseSelect } from "./selectors/user-select";

jest.mock("../repositories/user-repository");
jest.mock("../utils/password");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("getUser success", async () => {
      const mockUser = {
        id: "uuid-user-123",
        email: "test@example.com",
        name: "유재석",
        nickname: "tester",
      };

      (userRepository.findUniqueOrThrowData as jest.Mock).mockResolvedValue(
        mockUser
      );

      const userId = "uuid-user-123";

      const result = await userService.getUser(userId);

      expect(userRepository.findUniqueOrThrowData).toHaveBeenCalledWith({
        where: { id: userId },
        select: userBaseSelect,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("modifyUser", () => {
    it("modifyUser success", async () => {
      const mockUser = {
        id: "uuid-user-123",
        email: "test@example.com",
        name: "유재석",
        nickname: "newTester",
        image: "newImage.png",
      };

      const inputParams = {
        userId: "uuid-user-123",
        nickname: "newTester",
        image: "newImage.png",
        password: "newPassword123",
      };

      const encryptedPassword = "encryptedPassword123";

      (hashPassword as jest.Mock).mockResolvedValue(encryptedPassword);
      (userRepository.updateData as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.modifyUser(inputParams);

      expect(hashPassword).toHaveBeenCalledWith(inputParams.password);
      expect(userRepository.updateData).toHaveBeenCalledWith({
        where: { id: inputParams.userId },
        data: {
          nickname: inputParams.nickname,
          image: inputParams.image,
          encryptedPassword,
        },
        select: userBaseSelect,
      });
      expect(result).toEqual(mockUser);
    });
  });
});
