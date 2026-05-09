using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace API_Debugger.Service
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public AIService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }
        

        public async Task<string> AnalyzeError(string errorLog)
        {
            var prompt = $@"
You are a senior .NET developer.
Analyze the error and respond ONLY in JSON format:

{{
  ""Explanation"": ""..."",
  ""RootCause"": ""..."",
  ""FixSuggestion"": ""..."",
  ""Severity"": ""Low/Medium/High""
}}
Do not include markdown.
Do not include reasoning.
Do not include extra text.
Error:
{errorLog}
";

            
            var requestBody = new
            {
                model = "openrouter/free",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
            var apiKey = _config["OpenRouter:ApiKey"];

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            request.Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            //return content;
            var jsonDoc = JsonDocument.Parse(content);

            var aiContent = jsonDoc
                .RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return aiContent;
        }
        }
}
