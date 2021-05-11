import { RuleToken } from "./ruleToken";
import { TokenType } from "./tokenType";

export interface TokenizerContext {
    tokens: RuleToken[];
    parens: RuleToken[];
    atom: string[];
    modifier: TokenType | undefined;
}
