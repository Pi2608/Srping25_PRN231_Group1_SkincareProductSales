using DAL.Models.UserModel;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BLL.Services.Implements.UserServices
{
    public static class AuthService
    {
        public static string GenerateJwtToken(this User user, string secretKey, int expiredMinutes, string issuer, string audience)
        {
            var secretKeyInByte = Encoding.UTF8.GetBytes(secretKey);
            var sercurityKey = new SymmetricSecurityKey(secretKeyInByte);
            var credentials = new SigningCredentials(sercurityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.RoleName.ToString())
            };

            var token = new JwtSecurityToken
                (
                    issuer: issuer,
                    audience: audience,
                    expires: DateTime.UtcNow.AddMinutes(expiredMinutes),
                    claims: claims,
                    signingCredentials: credentials
                );

            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtTokenHandler.WriteToken(token);
            foreach (var claim in token.Claims)
            {
                Console.WriteLine($"{claim.Type}: {claim.Value}");
            }
            return jwtToken;
        }
    }
}
