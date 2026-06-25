# Installation for Claude Agents

## Agent Setup

1. Ensure your Claude agent has access to the skills repository
2. Configure the agent with the following environment variables:
   - `CLAUDE_SKILLS_PATH`: Path to the skills directory
   - `CLAUDE_AGENT_MODE`: Set to `true`

3. Initialize the agent:
   ```bash
   ./setup
   ```

4. Verify agent can access skills:
   - Run a test query using one of the available skills
   - Check logs for any errors

## Troubleshooting

If skills are not accessible:
- Verify path configuration
- Check file permissions
- Review agent logs for errors
