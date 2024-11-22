import userService from "../services/userService";
import userRepository from "../repositorys/userRepository";
import bcrypt, { hash } from "bcrypt";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const user = {
  id: "uuid",
  nickname: "user 1",
  email: "test@codeit.co.kr",
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
    test("유저 정보 가져오기", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { password, refreshToken, ...expectedUser } = user;

      const result = await userService.getUser(userData);

      expect(result).toEqual(expectedUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email); // 이메일 조회 확인
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        user.password
      );
    });

    test("유저 정보 가져오기 실패 - expectedUser가 null인 경우", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUser(userData)).rejects.toThrow(
        "회원 정보가 없습니다."
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    });

    test("유저 정보 가져오기 실패 - DB 오류 발생", async () => {
      (userRepository.findByEmail as jest.Mock).mockRejectedValue(
        new Error("internal server error")
      );

      await expect(userService.getUser(userData)).rejects.toThrow(
        "internal server error"
      );
    });

    test("유저 정보 가져오기 실패 - 비밀번호 불일치", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.getUser(userData)).rejects.toThrow(
        "비밀번호가 일치 하지 않습니다."
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email); // 이메일 조회 확인
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        user.password
      );
    });
  });

  describe("create user", () => {
    beforeEach(() => {
      (userRepository.findByEmail as jest.Mock).mockClear();
    });

    const { password, refreshToken, ...expectedUser } = user;

    test("회원가입", async () => {
      (userRepository.create as jest.Mock).mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      const result = await userService.createUser(userData);

      expect(result).toEqual(expectedUser);

      expect(bcrypt.hash).toHaveBeenCalledWith("qwer!@1234", 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: "hashedPassword",
      });
    });

    test("회원가입 실패 - DB 오류 발생", async () => {
      (userRepository.create as jest.Mock).mockRejectedValue(
        new Error("internal server error")
      );

      await expect(userService.createUser(userData)).rejects.toThrow(
        "internal server error"
      );

      expect(userRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: "hashedPassword",
      });
    });
  });
});
