using API_Debugger.Models;
using API_Debugger.Service;
using Microsoft.AspNetCore.Mvc;

namespace API_Debugger.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        private readonly AIService _aiService;

        public DebugController(AIService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze(DebugRequest request)
        {
            var result = await _aiService.AnalyzeError(request.ErrorLog);
            return Ok(result);
        }
    }
}
