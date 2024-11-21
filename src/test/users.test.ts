import userService from "../services/userService";
import userRepository from "../repositorys/userRepository";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const user = {
  id: "uuid",
  nickname: "user 1",
  email: "codeit@codeit.co.kr",
  password: "qwer!@1234",
  createAt: new Date(),
  updateAt: new Date(),
  refreshToken: "refresh-token",
};

const userData = {
  nickname: "user 1",
  email: "test@codeit.co.kr",
  password: "qwer!@1234",
};

jest.mock("../repositorys/userRepository");

describe("user service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get user", () => {
    beforeEach(() => {
      (userRepository.findByEmail as jest.Mock).mockClear();
    });

    const { password, refreshToken, ...expectedUser } = user;

    test("유저 정보 가져오기", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.getUser(userData);

      expect(result).toEqual(expectedUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email); // 이메일 조회 확인
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        user.password
      );
    });
  });
});
